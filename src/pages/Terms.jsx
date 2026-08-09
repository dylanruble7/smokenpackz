import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Terms() {
  return (
    <div className="smoke-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/" className="nav-link inline-flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back Home
        </Link>

        <h1 className="font-medieval text-4xl font-bold text-osrs-goldBright mb-2">Terms of Service</h1>
        <p className="text-stoner-haze/40 text-sm mb-8">Last modified: August 2026</p>

        <div className="space-y-6 text-stoner-haze/70">
          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">1. Introduction</h2>
            <p className="mb-3">
              SmokenPackz ("we", "us", or "our") is a marketplace that allows users to offer, sell, and buy OSRS accounts, gold, and bonds through our website at smokenpackz.com ("Site"). As a marketplace, SmokenPackz does not own all items listed on this site and acts as a commercial agent of Sellers. By agreeing to and accepting these Terms of Service, Sellers authorize SmokenPackz on their behalf to conclude contracts for sale with Buyers.
            </p>
            <p className="mb-3">
              These Terms of Service ("Agreement" or "Terms"), the Privacy Policy, and all policies and guidelines posted on the Site set out the terms and conditions on which SmokenPackz offers you access to and use of the Site as well as services, applications, and tools available therein (collectively "Services").
            </p>
            <p>
              By accessing or using the Site, you hereby agree to accept the terms and conditions set forth in this Agreement. If you do not accept all of the terms and conditions of this Agreement, please do not use this Site. You may not use the Site if you are not of legal age to form a binding contract, or if you are a person barred from using the Site under applicable laws.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">2. Definitions</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Buyer</strong> – User who accesses and uses the Site for the purpose of buying goods offered by Sellers.</li>
              <li><strong>Seller</strong> – User who accesses and uses the Site for the purpose of selling goods to Buyers.</li>
              <li><strong>User</strong> – Any person who accesses the Site for whatever purpose, whether registered or not.</li>
              <li><strong>Transaction Risks</strong> – The risks assumed by Users when conducting transactions via the Site, including misrepresentation, fraud, delivery failure, or breach of contract.</li>
              <li><strong>SmokenPackz Content</strong> – Information, text, images, video clips, directories, files, databases, or offers available on or through the Site.</li>
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">3. Use of the Site</h2>
            <p className="mb-3">
              Users may use this Site solely for their own personal or internal purposes. Each User agrees not to copy, reproduce, or download any SmokenPackz Content for the purpose of re-selling, re-distributing, mass mailing, operating a business that competes with SmokenPackz, or otherwise commercially exploiting SmokenPackz Content.
            </p>
            <p className="mb-3">
              No User shall undertake any scheme to undermine the integrity of the computer systems or networks used by SmokenPackz or any other User, and no User shall attempt to gain unauthorized access to such computer systems or networks.
            </p>
            <p>
              By using the Site, you represent and warrant that you have all necessary knowledge to deal with digital items, are aware of all risks associated with digital assets, will not use the Site for any illegal activity, and solely control your credentials.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">4. Prohibited Behavior</h2>
            <p className="mb-3">Information submitted to SmokenPackz shall not:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Contain fraudulent information or make fraudulent offers of items</li>
              <li>Be part of a scheme to defraud other Users</li>
              <li>Relate to the sale of products that infringe any third-party rights</li>
              <li>Violate any applicable law, statute, ordinance, or regulation</li>
              <li>Be defamatory, libelous, unlawfully threatening, or harassing</li>
              <li>Contain viruses, Trojan horses, worms, or other destructive devices</li>
              <li>Involve any countries, entities, or individuals prohibited by sanctions</li>
              <li>Contain material related to game cheats or game hacks</li>
              <li>Otherwise create any liability for SmokenPackz</li>
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">5. Transactions Between Buyers and Sellers</h2>
            <p className="mb-3">
              SmokenPackz provides an electronic web-based platform for exchanging information between Buyers and Sellers. For each transaction, the Seller is obligated to deliver the goods to the Buyer, and the Buyer is obligated to deliver appropriate payment.
            </p>
            <p className="mb-3">
              All sales are binding. Sellers must accurately describe items, and Buyers are responsible for reading descriptions before purchasing. Sellers must complete transactions in a prompt manner unless exceptional circumstances exist.
            </p>
            <p>
              Users are solely responsible for all terms and conditions of transactions conducted on or through the Site, including returns, warranties, shipping, fees, taxes, and handling.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">6. Refund Policy</h2>
            <p className="mb-3">
              All sales are final. Refunds are only issued if the item is not delivered or not as described. If this is the case, the Buyer will receive a full refund. The Buyer can request a refund by contacting our support team on Discord.
            </p>
            <p>
              Refunds can take up to 1 week to process. Customers who issue chargebacks for completed orders will be permanently banned from the Site.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">7. Payments</h2>
            <p className="mb-3">
              We accept the following payment methods: cryptocurrency (Bitcoin, Litecoin, Ethereum, USDT) via NOWPayments, CashApp, and OSRS GP. When you provide payment information, you represent and warrant that you are the authorized user of such information.
            </p>
            <p>
              SmokenPackz may verify details related to listings and transactions. We reserve the right to reject any item that we believe may be fraudulent, invalid, inauthentic, stolen, or related to any illegal activity.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">8. Disclaimer of Warranties</h2>
            <p className="mb-3">
              The features and services on the Site are provided on an "as is" and "as available" basis. SmokenPackz expressly disclaims any and all warranties, express or implied, including but not limited to warranties of condition, quality, durability, performance, accuracy, reliability, merchantability, or fitness for a particular purpose.
            </p>
            <p>
              SmokenPackz makes no representations or warranties about the validity, accuracy, correctness, reliability, or completeness of any information provided on or through the Site.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">9. Limitation of Liability</h2>
            <p className="mb-3">
              SmokenPackz shall not be liable for any special, direct, indirect, punitive, incidental, or consequential damages whatsoever, whether in contract, negligence, tort, strict liability, or otherwise, resulting from:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>The use or inability to use the Site</li>
              <li>Any defect in goods, data, information, or services purchased through the Site</li>
              <li>Unauthorized access to data or private information</li>
              <li>Statements, conduct, or material posted by Users</li>
              <li>Any other matter relating to the Site</li>
            </ul>
            <p className="mt-3">
              Regardless of the previous provisions, if SmokenPackz is found to have liability, its liability is limited to the greater of (a) the amount of the specific transaction in dispute, or (b) USD 100.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">10. Indemnification</h2>
            <p>
              Each User agrees to indemnify and hold harmless SmokenPackz, its affiliates, directors, officers, and employees from any and all losses, claims, and liabilities (including legal costs) which may arise directly or indirectly from the User's use of the Site, breach of this Agreement, or breach of any representations and warranties.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">11. Intellectual Property</h2>
            <p className="mb-3">
              SmokenPackz is the sole owner or lawful licensee of all rights to the Site and SmokenPackz Content. The Site and its Content embody trade secrets and intellectual property rights protected under worldwide copyright and other laws.
            </p>
            <p>
              "SmokenPackz" and related icons and logos are trademarks of SmokenPackz. Unauthorized copying, modification, use, or publication of these marks is strictly prohibited.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">12. Security</h2>
            <p className="mb-3">
              You are responsible for maintaining the confidentiality and security of your Account and password, and accept responsibility for all activities that occur under your Account. You must notify SmokenPackz immediately if the security of your login has been breached.
            </p>
            <p>
              SmokenPackz does not guarantee the confidentiality or security of any communication transmitted on or through the Site, and shall not be liable for any damage caused by viruses, malware, or other attacks.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">13. Amendments</h2>
            <p>
              SmokenPackz may amend this Agreement and Site policies at any time by posting the amended Agreement on the Site. The amended Agreement shall become effective on the date specified, and it shall be deemed that the User agrees with such amendments if the User continues to use the Site.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">14. Governing Law</h2>
            <p>
              This Agreement shall be governed by the laws of the United States. Any disputes arising from this Agreement shall be resolved through good faith negotiation, and if unresolved, through binding arbitration.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">15. Notice of Non-Affiliation and Disclaimer</h2>
            <p className="mb-3">
              SmokenPackz is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Jagex Ltd., RuneScape, Old School RuneScape, or any of its subsidiaries or affiliates. The official RuneScape website can be found at https://www.runescape.com/
            </p>
            <p>
              The names RuneScape, Old School RuneScape, OSRS Gold, and any related names, marks, emblems, and images are registered trademarks of their respective owners. Use of trademarks is covered by fair use principles.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">16. Miscellaneous</h2>
            <p className="mb-3">
              This Agreement, the Site's Privacy Policy, and all policies posted on the Site constitute the entire agreement between the User and SmokenPackz. SmokenPackz and the User are independent contractors, and no agency, partnership, or employee-employer relationship is intended.
            </p>
            <p>
              If any provision is held invalid or unenforceable, such provision shall be struck out and shall not affect the validity of the remaining provisions. Headings are for reference purposes only.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
