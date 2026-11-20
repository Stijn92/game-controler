"use strict";

const statusElement = document.getElementById("status");
const controllerNameElement = document.getElementById("controllerName");
const buttonsElement = document.getElementById("buttons");
const axesElement = document.getElementById("axes");

let previousButtons = [];

window.addEventListener("gamepadconnected", (event) => {
  statusElement.textContent = `Controller verbonden: ${event.gamepad.id}`;
  statusElement.classList.add("connected");
});

window.addEventListener("gamepaddisconnected", () => {
  statusElement.textContent = "Controller losgekoppeld";
  statusElement.classList.remove("connected");
  controllerNameElement.textContent = "Geen controller gevonden";
});

function renderController(controller) {
  controllerNameElement.textContent = controller.id;

  if (buttonsElement.children.length !== controller.buttons.length) {
    buttonsElement.replaceChildren();
    controller.buttons.forEach((_, index) => {
      const button = document.createElement("div");
      button.className = "button";
      button.textContent = `Knop ${index}`;
      buttonsElement.appendChild(button);
    });
  }

  controller.buttons.forEach((button, index) => {
    const element = buttonsElement.children[index];
    const isPressed = Boolean(button.pressed);
    element.classList.toggle("pressed", isPressed);
    element.title = `Waarde: ${button.value.toFixed(2)}`;

    if (isPressed && !previousButtons[index]) {
      console.log(`Knop ${index} ingedrukt`);
    }
  });
  previousButtons = controller.buttons.map((button) => Boolean(button.pressed));

  if (axesElement.children.length !== controller.axes.length) {
    axesElement.replaceChildren();
    controller.axes.forEach((_, index) => {
      const label = document.createElement("div");
      label.textContent = `As ${index}`;
      const track = document.createElement("div");
      track.className = "axis";
      const fill = document.createElement("div");
      fill.className = "axis-fill";
      track.appendChild(fill);
      axesElement.append(label, track);
    });
  }

  controller.axes.forEach((value, index) => {
    const track = axesElement.querySelectorAll(".axis")[index];
    const fill = track.firstElementChild;
    const position = ((value + 1) / 2) * 100;
    fill.style.width = `${position}%`;
  });
}

function update() {
  const controllers = navigator.getGamepads();
  const controller = controllers.find((gamepad) => gamepad !== null);

  if (controller) {
    renderController(controller);
  }

  requestAnimationFrame(update);
}

requestAnimationFrame(update);
