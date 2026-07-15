const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const senhaInput =
    document.getElementById("senha");

const mostrarSenha =
    document.getElementById("mostrarSenha");

const mensagemErro =
    document.getElementById("mensagemErro");

const abrirModalAdmin =
    document.getElementById("abrirModalAdmin");

const modalAdmin =
    document.getElementById("modalAdmin");

const fecharModalAdmin =
    document.getElementById("fecharModalAdmin");

const adminLoginForm =
    document.getElementById("adminLoginForm");

const adminEmail =
    document.getElementById("adminEmail");

const adminSenha =
    document.getElementById("adminSenha");

const mostrarSenhaAdmin =
    document.getElementById("mostrarSenhaAdmin");

const mensagemErroAdmin =
    document.getElementById("mensagemErroAdmin");

const EMAIL_USUARIO = "usuario@movieflix.com";
const SENHA_USUARIO = "123456";

const EMAIL_ADMIN = "admin@movieflix.com";
const SENHA_ADMIN = "123456";

function alternarVisibilidadeSenha(input, botao) {
    const oculta = input.type === "password";

    input.type = oculta
        ? "text"
        : "password";

    botao.textContent = oculta
        ? "🙈"
        : "👁";
}

function abrirModal() {
    modalAdmin.classList.add("ativo");
    document.body.classList.add("modal-aberto");

    mensagemErroAdmin.textContent = "";

    setTimeout(() => {
        adminEmail.focus();
    }, 200);
}

function fecharModal() {
    modalAdmin.classList.remove("ativo");
    document.body.classList.remove("modal-aberto");

    adminLoginForm.reset();
    mensagemErroAdmin.textContent = "";

    adminSenha.type = "password";
    mostrarSenhaAdmin.textContent = "👁";
}

mostrarSenha.addEventListener("click", function () {
    alternarVisibilidadeSenha(
        senhaInput,
        mostrarSenha
    );
});

mostrarSenhaAdmin.addEventListener("click", function () {
    alternarVisibilidadeSenha(
        adminSenha,
        mostrarSenhaAdmin
    );
});

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email =
        emailInput.value.trim().toLowerCase();

    const senha =
        senhaInput.value;

    mensagemErro.textContent = "";

    if (
        email === EMAIL_USUARIO &&
        senha === SENHA_USUARIO
    ) {
        localStorage.setItem(
            "movieflixUsuarioLogado",
            "true"
        );

        window.location.href = "index.html";
        return;
    }

    mensagemErro.textContent =
        "E-mail ou senha inválidos.";
});

abrirModalAdmin.addEventListener(
    "click",
    abrirModal
);

fecharModalAdmin.addEventListener(
    "click",
    fecharModal
);

modalAdmin.addEventListener("click", function (event) {
    if (event.target === modalAdmin) {
        fecharModal();
    }
});

document.addEventListener("keydown", function (event) {
    if (
        event.key === "Escape" &&
        modalAdmin.classList.contains("ativo")
    ) {
        fecharModal();
    }
});

adminLoginForm.addEventListener(
    "submit",
    function (event) {
        event.preventDefault();

        const email =
            adminEmail.value.trim().toLowerCase();

        const senha =
            adminSenha.value;

        mensagemErroAdmin.textContent = "";

        if (
            email === EMAIL_ADMIN &&
            senha === SENHA_ADMIN
        ) {
            localStorage.setItem(
                "movieflixAdminLogado",
                "true"
            );

            window.location.href = "admin.html";
            return;
        }

        mensagemErroAdmin.textContent =
            "E-mail ou senha de administrador inválidos.";
    }
);