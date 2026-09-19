export default function ContactPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Contact</h1>
      <p className="text-gray-600">
        The Wealth Modeler is free, with no login. Calculators run in your browser and do not send your numbers to our
        servers.
      </p>
      <div className="rounded-2xl bg-white p-6 shadow-card">
        <h2 className="text-xl font-semibold text-gray-900">Email</h2>
        <p className="mt-2 text-sm text-gray-600">
          Questions about the site or privacy:{' '}
          <a href="mailto:info@thewealthmodeler.com" className="font-semibold text-primary hover:underline">
            info@thewealthmodeler.com
          </a>
        </p>
        <p className="mt-4 text-sm text-gray-600">
          We do not take account sign-ups or collect calculator inputs. Please do not send sensitive financial details
          by email.
        </p>
      </div>
    </div>
  );
}
