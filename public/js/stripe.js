import axios from 'axios';
import { showAlert } from './alerts';

const stripe = window.Stripe(
  'pk_test_51LNfW3SGpk5EwJ3q3U3RsuBbtYkTN8Av3KY62GMqzajMr4igl2POngdyTmcZB3rZUJeOe0s3fzYqvJREj7xDAjbm00Loc7DhIK'
);

export const bookTour = async (tourId) => {
  try {
    //1)Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    console.log(session);

    //2)create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
