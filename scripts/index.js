Hooks.once("init", () => {
  game.settings.register("foundry-vtt-hotbar-lock", "hotbarLocked", {
    name: "Hotbar Lock",
    scope: "client", // This specifies a client-stored setting
    config: false, // This specifies that the setting appears in the configuration view
    type: Boolean,
    default: false, // The default value for the setting
  });
});

Hooks.on("renderHotbar", function (app, html, data) {
  let hotbarLocked = game.settings.get(
    "foundry-vtt-hotbar-lock",
    "hotbarLocked"
  );

  const lock = $(`
    <div id="hotbar-lock" class="bar-controls flexcol">
        <a id="bar-lock-toggle" class="${hotbarLocked ? "locked" : "unlocked"}">
            <i class="fas fa-lock"></i>
            <i class="fas fa-unlock"></i>
        </a>
    </div>`);
  const lockToggle = lock.find("#bar-lock-toggle");
  html.find("#action-bar").after(lock);

  const assignHotbarMacroFn = User.prototype.assignHotbarMacro;
  User.prototype.assignHotbarMacro = function (...args) {
    if (hotbarLocked) {
      return;
    }
    assignHotbarMacroFn.call(this, ...args);
  };

  lock.on("click", () => {
    hotbarLocked = !hotbarLocked;
    game.settings.set("foundry-vtt-hotbar-lock", "hotbarLocked", hotbarLocked);
    if (hotbarLocked) {
      lockToggle.addClass("locked");
      lockToggle.removeClass("unlocked");
    } else {
      lockToggle.addClass("unlocked");
      lockToggle.removeClass("locked");
    }
  });

  html.find("#bar-toggle").on("click", () => {
    lock.toggleClass("d-none");
  });
});
