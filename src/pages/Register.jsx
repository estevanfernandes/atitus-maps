import React, { useState } from "react";
import { Navbar, Logo, Title, Input, Button } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/authService";

export function Register() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        try {
            await signUp(nome, email, senha);
            navigate("/login");
        } catch (err) {
            setErro(err.message);
        }
    };

    return (
        <>
            <div className="max-w-md mx-auto px-6 py-8 relative z-10">
                <div className="text-center">
                    <Logo />
                </div>

                <div className="pt-6 pb-4">
                    <Title title="Explore novos lugares!" />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="pb-4">
                        <Input
                            label="Nome:"
                            placeholder=""
                            type="text"
                            required
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                        />
                    </div>
                    <div className="pb-4">
                        <Input
                            label="E-mail:"
                            placeholder=""
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="pb-4">
                        <Input
                            label="Senha:"
                            placeholder=""
                            type="password"
                            required
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                        />
                    </div>
                    {erro && <p style={{ color: "red" }}>{erro}</p>}

                    <div className="text-center pt-4">
                        <Button type="submit">
                            <span className="inline-flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H6a1 1 0 1 1 0-2h5V6a1 1 0 0 1 1-1Z" /></svg>
                                Criar conta
                            </span>
                        </Button>
                    </div>
                </form>

                <div className="text-center pt-8">
                    <Link to="/login" style={{ color: "#fff", textDecoration: "underline" }}>
                        Já tem cadastro? <strong>Faça Login</strong>
                    </Link>
                </div>
            </div>
        </>
    );
}