import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { discordUrls } from '../data/products.js'

export default function RefundPolicy() {
  return (
    <div className="smoke-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/" className="nav-link inline-flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back Home
        </Link>

        <h1 className="font-medieval text-4xl font-bold text-osrs-goldBright mb-2">Refund Policy</h1>
        <p className="text-stoner-haze/40 text-sm mb-8">Last modified: August 2026</p>

        <div className="space-y-6 text-stoner-haze/70">
          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">1. General Policy</h2>
            <p className="mb-3">
              All sales on SmokenPackz are final. We do not offer refunds or exchanges except in cases where the item is not delivered or not as described. This policy applies to all payment methods including cryptocurrency, CashApp, and OSRS GP.
            </p>
            <p>
              By making a purchase on SmokenPackz, you acknowledge and agree to this refund policy.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">2. Eligible Refunds</h2>
            <p className="mb-3">A refund may be issued in the following circumstances:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>The item was not delivered to the Buyer</li>
              <li>The item delivered does not match the listing description</li>
              <li>The item is defective or unusable (e.g., account recovered, banned prior to sale)</li>
              <li>The Seller failed to complete the transaction</li>
            </ul>
            <p className="mt-3">
              In these cases, the Buyer will receive a full refund of the purchase amount.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">3. Non-Eligible Refunds</h2>
            <p className="mb-3">Refunds will not be issued for:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Buyer's remorse or change of mind</li>
              <li>Items that have been used, modified, or transferred after delivery</li>
              <li>Accounts that have been banned due to Buyer's actions after delivery (botting, rule violations, etc.)</li>
              <li>Items purchased and delivered as described</li>
              <li>Cryptocurrency transactions where the Buyer sent the wrong amount or to the wrong address</li>
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">4. How to Request a Refund</h2>
            <p className="mb-3">
              To request a refund, the Buyer must:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Contact SmokenPackz support on Discord within 48 hours of the transaction</li>
              <li>Provide the order ID and a description of the issue</li>
              <li>Allow up to 1 week for the refund to be processed</li>
            </ul>
            <p className="mt-3">
              Refunds for cryptocurrency payments will be issued in the original cryptocurrency at the original USD value. Refunds for CashApp payments will be sent back to the original CashApp account. Refunds for OSRS GP payments will be returned in GP.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">5. Chargeback Policy</h2>
            <p className="mb-3">
              Once an order has been marked as delivered and received by the Buyer, the order is considered Completed and the sale is final. Customers who issue chargebacks for Completed orders will be permanently banned from SmokenPackz.
            </p>
            <p>
              If you face an issue with a non-completed order, contact our support team on Discord instead of issuing a chargeback. We are committed to resolving issues fairly and promptly.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">6. Account Warranty</h2>
            <p className="mb-3">
              All accounts sold on SmokenPackz come with a warranty against recovery. If an account is recovered by the original owner within 30 days of purchase, the Buyer is eligible for a full refund or replacement account of equal value.
            </p>
            <p>
              This warranty does not cover bans resulting from the Buyer's own actions, including but not limited to botting, scamming, real-world trading violations, or sharing the account.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">7. Contact</h2>
            <p className="mb-3">
              For any refund-related questions, please contact us on Discord:
            </p>
            <div className="flex gap-3 flex-wrap">
              {discordUrls.map((d, i) => (
                <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
                   className="btn-secondary inline-flex items-center gap-2">
                  Discord Server {i + 1}
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
