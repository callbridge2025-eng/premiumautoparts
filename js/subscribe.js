document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("subscribeForm");
  const messageDiv = document.getElementById("subscribeMessage");

  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    messageDiv.innerHTML = "";

    if (!emailRegex.test(email)) {
      messageDiv.innerHTML = `
        <div class="alert alert-danger">
          Please enter a valid email address.
        </div>
      `;
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
        messageDiv.innerHTML = `
          <div class="alert alert-success">
            ${data.message}
          </div>
        `;
        emailInput.value = "";
      } else {
        messageDiv.innerHTML = `
          <div class="alert alert-danger">
            ${data.message || "Something went wrong."}
          </div>
        `;
      }

    } catch (error) {
      messageDiv.innerHTML = `
        <div class="alert alert-danger">
          Server error. Please try again later.
        </div>
      `;
    }
  });

});
