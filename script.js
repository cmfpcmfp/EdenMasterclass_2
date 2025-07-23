const stripe = Stripe("pk_live_YOUR_REAL_KEY_HERE");
document.getElementById("checkout-button").addEventListener("click", () => {
  fetch("/create-checkout-session", { method: "POST" })
    .then((res) => res.json())
    .then((data) => stripe.redirectToCheckout({ sessionId: data.id }));
});
