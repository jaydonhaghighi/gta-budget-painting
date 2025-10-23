import { type Service } from '../../data/services';
import './ServiceForms.css';

interface FlatRateServiceFormProps {
  service: Service;
  onProceed: (formData: any) => void;
}

const FlatRateServiceForm = ({ service, onProceed }: FlatRateServiceFormProps) => {
  const handleProceed = () => {
    onProceed({
      serviceId: service.id,
      serviceName: service.name,
      price: service.flatRate
    });
  };

  return (
    <div className="flat-rate-service-form">
      <div className="flat-rate-card">
        <div className="price-display">
          <div className="price-label">Fixed Price</div>
          <div className="price-amount">${service.flatRate}</div>
          <div className="price-note">All-inclusive pricing</div>
        </div>

        <div className="whats-included">
          <h4>What's Included:</h4>
          <ul>
            <li>Professional painting service</li>
            <li>All materials and supplies</li>
            <li>Surface preparation</li>
            <li>Clean-up after completion</li>
            <li>Quality guaranteed</li>
          </ul>
        </div>

        <div className="service-details">
          <h4>Service Details:</h4>
          <p>{service.seoDescription || service.description}</p>
        </div>

        <button
          className="btn-proceed"
          onClick={handleProceed}
        >
          Continue to Booking →
        </button>

        <div className="flat-rate-disclaimer">
          <strong>Note:</strong> This is our standard rate for this service. Our professionals will confirm all details before the scheduled date.
        </div>
      </div>
    </div>
  );
};

export default FlatRateServiceForm;

