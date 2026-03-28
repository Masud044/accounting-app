import React from 'react';

import ReceiveTable from '../components/ReceiveTable';
import { SectionContainer } from '@/components/SectionContainer';

const receive = () => {
  return (
    <SectionContainer>

       <div>
        <ReceiveTable></ReceiveTable>
    </div>
    </SectionContainer>
   
  );
};

export default receive;