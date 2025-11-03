'use client';

import { Suspense, use } from 'react';
import { ShopDetailsInner } from '../ [id]/[code]/page';

// This page handles single-segment URLs like /shopdetails/earring?id=4935&code=BT5129
// The component reads id and code from query params, so we pass empty code in params
const ShopDetailsSingleSegment = ({ params }: { params: Promise<{ id: string }> }) => {
  // ✅ Unwrap params Promise using React.use() for Next.js 15
  const unwrappedParams = use(params);
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopDetailsInner params={{ id: unwrappedParams.id, code: '' }} />
    </Suspense>
  );
};

export default ShopDetailsSingleSegment;

