'use client';

import { Suspense } from 'react';
import ShopDetailsInner from '../ [id]/[code]/page';

// This page handles single-segment URLs like /shopdetails/earring?id=4935&code=BT5129
// The component reads id and code from query params, so we pass empty code in params
const ShopDetailsSingleSegment = ({ params }: { params: { id: string } }) => {
  // Create a wrapper that passes the params to ShopDetailsInner
  // Since ShopDetailsInner expects { id, code }, we pass code as empty
  // and it will read the actual code from query params
  const WrappedComponent = () => {
    return <ShopDetailsInner params={{ id: params.id, code: '' }} />;
  };
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WrappedComponent />
    </Suspense>
  );
};

export default ShopDetailsSingleSegment;

