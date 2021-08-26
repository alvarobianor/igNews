import { signIn, useSession } from 'next-auth/client';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession()

  const handleSubscribe = async () => {
    if (!session) {
      signIn()
      return;
    }

    try {
      const { data } = await api.post('/subscribe');
      const { sessionId } = data

      const stripeJs = await getStripeJs()

      await stripeJs.redirectToCheckout({
        sessionId
      })


    } catch (error) {
      alert(error)
    }



  }

  return <>
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}>
      Subscribe Now!
    </button>
  </>
}