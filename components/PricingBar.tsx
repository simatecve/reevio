export default function PricingBar() {
  return (
    <div className="bg-gray-900 py-4 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-white text-lg">
          <span className="font-semibold">Where's the pricing?</span>{' '}
          <span className="text-gray-300">There's none, because reevio is 100% free</span>{' '}
          <span className="text-green-400">💚</span>
        </p>
      </div>
    </div>
  );
}