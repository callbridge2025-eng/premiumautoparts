document.getElementById("subscribeForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const emailInput = document.getElementById("email");
  const email = emailInput.value.trim();

  if (!email) {
    alert("Please enter a valid email.");
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
    alert(data.message);
    emailInput.value = "";

  } catch (error) {
    alert("Something went wrong.");
  }
});
