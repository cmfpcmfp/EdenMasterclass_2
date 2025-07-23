const stripe = Stripe("pk_test_YOUR_PUBLISHABLE_KEY");
document.getElementById("checkout-button").addEventListener("click", () => {
  fetch("/create-checkout-session", { method: "POST" })
    .then((res) => res.json())
    .then((data) => stripe.redirectToCheckout({ sessionId: data.id }));
});