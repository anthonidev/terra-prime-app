import { Liner } from '@/types/leads.types';
import React from 'react';

type Props = {
  data: Liner[];
};

const LinnerCards = ({ data }: Props) => {
  console.log('LinnerCards data', data);
  return <div>LinnerCards</div>;
};

export default LinnerCards;
