import React, { useState } from "react";
import { Navbar, Logo, Title, Input, Button } from "../components";
import { signIn } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const token = await signIn(email, senha);
      login(token);
      navigate("/map");
    } catch (err) {
      setErro(err.message);
    }
  };
//a
  return (
    <>

      <div className="max-w-md mx-auto px-6 py-8 relative z-10">
        <div className="text-center">
          <Logo />
        </div>

        <div className="pt-8 pb-6">
          <Title title="Explore novos lugares!" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pb-4">
            <Input
              label="E-mail:"
              placeholder=""
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="pb-4">
            <Input
              label="Senha:"
              placeholder=""
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          {erro && <p style={{ color: "red" }}>{erro}</p>}

          <div className="text-center pt-4">
            <Button type="submit">
              <span className="inline-flex items-center gap-2">
                {/* Ícone de usuário SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4" fill="currentColor" />
                  <path fill="currentColor" d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4v1H4v-1z" />
                </svg>
                Acessar
              </span>
            </Button>
          </div>
        </form>

        <div className="text-center pt-8">
          <Link
            to="/register"
            className="text-white underline text-sm"
          >
            Ainda não tem conta? <strong> Clique aqui e cadastre-se.</strong>
          </Link>
        </div>
      </div>
    </>
  );
}