import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';

export default function ConfiguracoesPage() {
  return (
    <DashboardLayout title="Configurações" activePath="/configuracoes">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <h2 className="text-lg font-semibold">Configurações Gerais</h2>
          <p className="text-sm text-gray-600">Gerencie as configurações gerais do sistema.</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Usuários</h2>
          <p className="text-sm text-gray-600">Adicione, edite ou remova usuários do sistema.</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Notificações</h2>
          <p className="text-sm text-gray-600">Configure as preferências de notificações.</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Segurança</h2>
          <p className="text-sm text-gray-600">Ajuste as configurações de segurança e privacidade.</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Integrações</h2>
          <p className="text-sm text-gray-600">Gerencie integrações com serviços externos.</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Aparência</h2>
          <p className="text-sm text-gray-600">Personalize a aparência do sistema.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
