import { saleCollectorInfo } from '@infrastructure/server-actions/cobranza.actions';
import DataForm from './DataForm';

interface ContentProps {
  slug: string;
}

export default async function Content({ slug }: ContentProps) {
  const { sale, urbanDevelopment } = await saleCollectorInfo(slug);

  return <DataForm sale={sale} urbanDevelopment={urbanDevelopment} />;
}
