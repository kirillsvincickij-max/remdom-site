(() => {
  "use strict";

  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-nav");
  const requestForm = document.querySelector("#request-form");
  const formStatus = document.querySelector("#form-status");
  const year = document.querySelector("#year");

  if (year) year.textContent = String(new Date().getFullYear());

  if (menuToggle && navigation) {
    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Открыть меню");
      navigation.classList.remove("is-open");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Открыть меню" : "Закрыть меню");
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (
        navigation.classList.contains("is-open") &&
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // Service links can prefill the optional description field.
  document.querySelectorAll("[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
      const details = document.querySelector("#details");
      if (details && !details.value.trim()) {
        details.value = link.dataset.service || "";
      }
    });
  });

  const validators = {
    name: (value) => value.trim().length >= 2
      ? ""
      : "Введите имя (не менее 2 символов).",
    phone: (value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15
        ? ""
        : "Проверьте номер: укажите от 7 до 15 цифр.";
    }
  };

  const showFieldError = (field, message) => {
    const error = document.querySelector(`#${field.id}-error`);
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message;
    return !message;
  };

  if (requestForm && formStatus) {
    ["name", "phone"].forEach((id) => {
      const field = requestForm.elements.namedItem(id);
      if (!field) return;
      field.addEventListener("blur", () => {
        showFieldError(field, validators[id](field.value));
      });
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") {
          showFieldError(field, validators[id](field.value));
        }
      });
    });

    requestForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = requestForm.elements.namedItem("name");
      const phone = requestForm.elements.namedItem("phone");
      const consent = requestForm.elements.namedItem("consent");
      const nameValid = name ? showFieldError(name, validators.name(name.value)) : false;
      const phoneValid = phone ? showFieldError(phone, validators.phone(phone.value)) : false;
      const consentError = document.querySelector("#consent-error");
      const consentValid = Boolean(consent && consent.checked);

      if (consentError) consentError.textContent = consentValid
        ? ""
        : "Для продолжения отметьте согласие.";
      if (consent) consent.setAttribute("aria-invalid", consentValid ? "false" : "true");

      if (!nameValid || !phoneValid || !consentValid) {
        formStatus.textContent = "Проверьте поля, отмеченные сообщениями об ошибках. Данные не отправлены.";
        formStatus.className = "form-status is-error";
        const firstInvalid = requestForm.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Intentionally do not send data: this is a static demonstration without a receiver.
      formStatus.textContent = "Проверка пройдена. Это демонстрационный режим: заявка НЕ отправлена и никуда не передана.";
      formStatus.className = "form-status is-valid";
    });
  }
})();
