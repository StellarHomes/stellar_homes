import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import './Restablecer_Contra.css';

document.addEventListener("DOMContentLoaded", () => {
    // Crear el header
    const header = document.createElement("header");
    const backButton = document.createElement("a");
    backButton.href = "./";
    backButton.className = "button";
    backButton.textContent = "Volver";
    header.appendChild(backButton);
    document.body.appendChild(header);

    // Crear la sección del formulario
    const section = document.createElement("section");
    section.className = "form-section";

    const title = document.createElement("h2");
    title.textContent = "Recuperar Contraseña";
    section.appendChild(title);

    const form = document.createElement("form");
    form.action = "./PHP_Contrase/solicitud.php";
    form.method = "post";

    const formGroup = document.createElement("div");
    formGroup.className = "form-group";

    const label = document.createElement("label");
    label.setAttribute("for", "email");
    label.textContent = "Correo Electrónico:";

    const input = document.createElement("input");
    input.type = "email";
    input.id = "email";
    input.name = "email";
    input.placeholder = "Ingrese su correo electrónico";
    input.required = true;

    formGroup.appendChild(label);
    formGroup.appendChild(input);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Enviar correo de recuperación";

    form.appendChild(formGroup);
    form.appendChild(submitButton);
    section.appendChild(form);
    document.body.appendChild(section);

    // Crear el footer
    const footer = document.createElement("footer");
    const footerText = document.createElement("p");
    footerText.innerHTML = "&copy; 2024 Inmobiliaria. Todos los derechos reservados.";
    footer.appendChild(footerText);
    document.body.appendChild(footer);

    // Validación con SweetAlert2
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Siempre evitamos el envío primero
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo vacío',
                text: 'Por favor, ingrese su correo electrónico.',
                confirmButtonColor: '#FFB300'
            });
        } else if (!emailRegex.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Correo no válido',
                text: 'Ingrese un correo electrónico válido.',
                confirmButtonColor: '#FFB300'
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Correo enviado',
                text: 'Se ha enviado un enlace de recuperación a tu correo electrónico.',
                confirmButtonColor: '#28a745'
            }).then(() => {
                form.submit(); // Enviar el formulario manualmente
            });
        }
    });
});
