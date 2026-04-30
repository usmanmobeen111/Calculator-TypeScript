let btn = document.querySelectorAll(".btn");
let operatorBtn = document.querySelectorAll(".operator");
let display = document.querySelector(".display");
console.log(display);
btn.forEach((button) => {
    button.addEventListener("click", () => {
        if (!(button.classList.contains("equal") || button.classList.contains("clear")))
            display.textContent += button.textContent;
    });
});
export {};
