document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("subscribeForm");

  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        emailInput.value = "";
      } else {
        alert(data.message || "Something went wrong.");
      }

    } catch (error) {
      console.error("Subscription error:", error);
      alert("Server error. Please try again later.");
    }
  });

});
