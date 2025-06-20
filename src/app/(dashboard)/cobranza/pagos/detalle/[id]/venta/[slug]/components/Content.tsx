import { saleCollectorInfo } from '@infrastructure/server-actions/cobranza.actions';
import DataForm from './DataForm';

export default async function Content({ slug }: { slug: string }) {
  const { sale, urbanDevelopment } = await saleCollectorInfo(slug);

  return <DataForm sale={sale} urbanDevelopment={urbanDevelopment} />;
}
