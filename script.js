document.querySelectorAll(".mecha-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(0.96)" },
        { transform: "scale(1.02)" },
        { transform: "scale(1)" }
      ],
      {
        duration: 220,
        easing: "ease-out"
      }
    );
  });
});
