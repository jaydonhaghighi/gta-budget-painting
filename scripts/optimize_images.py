#!/usr/bin/env python3
"""
Optimize large images in-place under public/ for better web performance.

Defaults:
- process jpg/jpeg/png/webp files
- only process files >= 200KB
- resize long edge down to max 1600px
- JPEG/WEBP quality 74
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from PIL import Image


SUPPORTED_EXTS = {".jpg", ".jpeg", ".png", ".webp"}


@dataclass
class Result:
    path: Path
    before: int
    after: int
    resized: bool

    @property
    def delta(self) -> int:
        return self.before - self.after


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Optimize large image assets in-place.")
    parser.add_argument("--root", default="public", help="Root directory containing image assets.")
    parser.add_argument("--min-size", type=int, default=200_000, help="Process files >= this many bytes.")
    parser.add_argument("--max-edge", type=int, default=1600, help="Maximum allowed long edge in pixels.")
    parser.add_argument("--quality", type=int, default=74, help="JPEG/WEBP quality (1-100).")
    parser.add_argument("--dry-run", action="store_true", help="Report what would change without writing files.")
    return parser.parse_args()


def iter_images(root: Path) -> Iterable[Path]:
    for p in root.rglob("*"):
        if p.is_file() and p.suffix.lower() in SUPPORTED_EXTS:
            yield p


def maybe_resize(image: Image.Image, max_edge: int) -> tuple[Image.Image, bool]:
    w, h = image.size
    if max(w, h) <= max_edge:
        return image, False
    resized = image.copy()
    resized.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
    return resized, True


def optimize_file(path: Path, max_edge: int, quality: int, dry_run: bool) -> Result | None:
    before = path.stat().st_size
    suffix = path.suffix.lower()

    with Image.open(path) as img:
        optimized, resized = maybe_resize(img, max_edge=max_edge)

        if suffix in {".jpg", ".jpeg"}:
            if optimized.mode in ("RGBA", "P"):
                optimized = optimized.convert("RGB")
            save_kwargs = {
                "format": "JPEG",
                "quality": quality,
                "optimize": True,
                "progressive": True,
            }
        elif suffix == ".png":
            save_kwargs = {
                "format": "PNG",
                "optimize": True,
            }
        elif suffix == ".webp":
            if optimized.mode in ("RGBA", "P"):
                optimized = optimized.convert("RGB")
            save_kwargs = {
                "format": "WEBP",
                "quality": quality,
                "method": 6,
            }
        else:
            return None

        if dry_run:
            # Approximate no-op output for dry-run mode.
            return Result(path=path, before=before, after=before, resized=resized)

        optimized.save(path, **save_kwargs)

    after = path.stat().st_size
    return Result(path=path, before=before, after=after, resized=resized)


def main() -> int:
    args = parse_args()
    root = Path(args.root)
    if not root.exists():
        print(f"Root not found: {root}")
        return 1

    candidates = [p for p in iter_images(root) if p.stat().st_size >= args.min_size]
    if not candidates:
        print("No images matched optimization criteria.")
        return 0

    results: list[Result] = []
    for p in candidates:
        result = optimize_file(
            path=p,
            max_edge=args.max_edge,
            quality=args.quality,
            dry_run=args.dry_run,
        )
        if result is None:
            continue
        results.append(result)

    total_before = sum(r.before for r in results)
    total_after = sum(r.after for r in results)
    total_saved = total_before - total_after

    print(f"Processed files: {len(results)}")
    print(f"Total before:    {total_before:,} bytes")
    print(f"Total after:     {total_after:,} bytes")
    print(f"Total saved:     {total_saved:,} bytes")

    top = sorted(results, key=lambda r: r.delta, reverse=True)[:20]
    print("Top reductions:")
    for item in top:
        marker = " resized" if item.resized else ""
        print(f"{item.delta:>10,}  {item.path}{marker}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
