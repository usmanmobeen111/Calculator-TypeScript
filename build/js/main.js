const buttons = document.querySelectorAll(".btn");
const displayInput = document.querySelector(".display_input");
const displayOutput = document.querySelector(".display_output");
let currentValue = "0";
let storedValue = null;
let pendingOperator = null;
let shouldResetDisplay = false;
let expression = "";
const operatorLabels = {
    "+": "+",
    "-": "-",
    "*": "x",
    "/": "/",
};
function updateDisplay() {
    if (!displayInput || !displayOutput)
        return;
    displayInput.textContent = expression;
    displayOutput.textContent = currentValue;
}
function formatResult(value) {
    if (!Number.isFinite(value))
        return "Error";
    const rounded = Number(value.toPrecision(12));
    return rounded.toLocaleString("en-US", {
        maximumFractionDigits: 10,
        useGrouping: false,
    });
}
function calculate(left, right, operator) {
    if (operator === "/" && right === 0)
        return null;
    switch (operator) {
        case "+":
            return left + right;
        case "-":
            return left - right;
        case "*":
            return left * right;
        case "/":
            return left / right;
    }
}
function inputDigit(value) {
    if (currentValue === "Error" || shouldResetDisplay) {
        currentValue = value === "." ? "0." : value;
        shouldResetDisplay = false;
        updateDisplay();
        return;
    }
    if (value === "." && currentValue.includes("."))
        return;
    if (currentValue === "0" && value !== ".") {
        currentValue = value;
    }
    else {
        currentValue += value;
    }
    updateDisplay();
}
function inputOperator(operator) {
    if (currentValue === "Error")
        clearCalculator();
    const numericValue = Number(currentValue);
    if (storedValue !== null && pendingOperator && !shouldResetDisplay) {
        const result = calculate(storedValue, numericValue, pendingOperator);
        if (result === null) {
            currentValue = "Error";
            storedValue = null;
            pendingOperator = null;
            expression = "Cannot divide by zero";
            shouldResetDisplay = true;
            updateDisplay();
            return;
        }
        storedValue = result;
        currentValue = formatResult(result);
    }
    else {
        storedValue = numericValue;
    }
    pendingOperator = operator;
    expression = `${formatResult(storedValue)} ${operatorLabels[operator]}`;
    shouldResetDisplay = true;
    updateDisplay();
}
function showResult() {
    if (storedValue === null || pendingOperator === null || shouldResetDisplay)
        return;
    const rightValue = Number(currentValue);
    const result = calculate(storedValue, rightValue, pendingOperator);
    if (result === null) {
        currentValue = "Error";
        expression = "Cannot divide by zero";
    }
    else {
        expression = `${formatResult(storedValue)} ${operatorLabels[pendingOperator]} ${formatResult(rightValue)} =`;
        currentValue = formatResult(result);
    }
    storedValue = null;
    pendingOperator = null;
    shouldResetDisplay = true;
    updateDisplay();
}
function clearCalculator() {
    currentValue = "0";
    storedValue = null;
    pendingOperator = null;
    shouldResetDisplay = false;
    expression = "";
    updateDisplay();
}
function handleValue(value) {
    if (/^\d$/.test(value) || value === ".") {
        inputDigit(value);
        return;
    }
    if (["+", "-", "*", "/"].includes(value)) {
        inputOperator(value);
        return;
    }
    if (value === "=") {
        showResult();
        return;
    }
    if (value === "C") {
        clearCalculator();
    }
}
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        if (value)
            handleValue(value);
    });
});
document.addEventListener("keydown", (event) => {
    const keyMap = {
        Enter: "=",
        Escape: "C",
        Backspace: "C",
        x: "*",
        X: "*",
    };
    const value = keyMap[event.key] ?? event.key;
    if (/^\d$/.test(value) || [".", "+", "-", "*", "/", "=", "C"].includes(value)) {
        event.preventDefault();
        handleValue(value);
    }
});
updateDisplay();
