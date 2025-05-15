import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Login = () => {
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [domainError, setDomainError] = useState("");
  const navigate = useNavigate();

  const validateDomain = (value: string) => {
    if (!value) {
      return "Domínio é obrigatório";
    }
    if (value.length !== 3) {
      return "Domínio deve ter exatamente 3 letras";
    }
    if (!/^[a-zA-Z]+$/.test(value)) {
      return "Domínio deve conter apenas letras";
    }
    return "";
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setDomain(value);
    setDomainError(validateDomain(value));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, domain }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Login realizado com sucesso");
        // Salve o usuário/token se for o caso
        navigate("/dashboard");
      } else {
        toast.error(data.detail || "Erro ao fazer login");
      }
    } catch (error) {
      toast.error("Erro de conexão com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-bluePrimary">Sistema de Controle</h1>
          <p className="mt-2 text-gray-600">Entre com suas credenciais para acessar</p>
        </div>
        
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Digite seu domínio, email e senha para entrar
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domínio</Label>
                <Input
                  id="domain"
                  type="text"
                  placeholder="DOM"
                  value={domain}
                  onChange={handleDomainChange}
                  maxLength={3}
                  required
                  className="h-11 uppercase"
                  aria-invalid={!!domainError}
                />
                {domainError && (
                  <p className="text-sm text-red-500 mt-1">{domainError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <a 
                    href="#" 
                    className="text-xs text-bluePrimary hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full h-11 bg-bluePrimary hover:bg-blue-800"
                disabled={isLoading || !!domainError}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
