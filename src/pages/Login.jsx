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

  return (
    <>
    
      <div className="max-w-md mx-auto p-4">
        <div className="text-center">
          <Logo />
        </div>

        <div className="pt-6 pb-4">
          <Title title="Explore novos lugares!" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pb-4">
            <Input
              placeholder="E-mail"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="pb-4">
            <Input
              placeholder="Senha"
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          {erro && <p style={{ color: "red" }}>{erro}</p>}

          <div className="text-center pt-4">
            <Button type="submit">Acessar</Button>
          </div>
        </form>

        <div className="text-center pt-8">
          <Link
            to="/register"
            style={{ color: "#fff", textDecoration: "underline" }}
          >
            Ainda não tem conta? Clique aqui e cadastre-se.
          </Link>
        </div>
      </div>
    </>
  );
}