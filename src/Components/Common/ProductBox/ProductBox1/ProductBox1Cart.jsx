// import React, { useContext, useEffect, useMemo, useState } from 'react';
// import { Input, InputGroup } from 'reactstrap';
// import { useTranslation } from '@/app/i18n/client';
// import Btn from '@/Elements/Buttons/Btn';
// import I18NextContext from '@/Helper/I18NextContext';
// import CartContext from '@/Helper/CartContext';
// import VariationModal from './VariationModal';
// import { RiAddLine, RiSubtractLine } from 'react-icons/ri';

// const ProductBox1Cart = ({ productObj }) => {

//   const { cartProducts, handleIncDec } = useContext(CartContext);
//   const [variationModal, setVariationModal] = useState('');
//   const { i18Lang } = useContext(I18NextContext);
//   const { t } = useTranslation(i18Lang, 'common');
//   const [productQty, setProductQty] = useState(0);
//   const [isOpen, setIsOpen] = useState(false);
//   const getSelectedVariant = useMemo(() => {
//     return cartProducts.find((elem) => elem.product_id === productObj.id);
//   }, [cartProducts]);
//   useEffect(() => {
//     if (cartProducts.length > 0) {
//       const foundProduct = cartProducts.find((elem) => elem.product_id === productObj.id);
//       if (foundProduct) {
//         setIsOpen(true);
//         setProductQty(foundProduct.quantity); // Use the quantity from the found product directly
//       } else {
//         setProductQty(0);
//         setIsOpen(false);
//       }
//     } else {
//       setProductQty(0);
//       setIsOpen(false);
//     }
//   }, [cartProducts]);

//   console.log("🚀 ~ ProductBox1Cart ~ productObj:", productObj)

//   return (
//     <>
//       <div className='add-to-cart-box'>
//         <Btn
//           className='btn-add-cart addcart-button'
//           disabled={productObj?.stock_status !== 'in_stock' ? true : false}
//           onClick={() => {
//            productObj.external_url? window.open(productObj.external_url,"_blank"): productObj?.stock_status == 'in_stock' && productObj?.type === 'classified' ? setVariationModal(productObj?.id) : handleIncDec(1, productObj, productQty, setProductQty, setIsOpen);
//           }}>
//           {productObj?.stock_status == 'in_stock' ? (
//             <>
//               {productObj?.external_url ? 
//               productObj?.external_button_text || t('BuyNow')
//               : <>
//                   {t('Add')}
//                   <span className='add-icon'>
//                     <RiAddLine/>
//                   </span>
//                 </>
//               }
//             </>
//           ) : (
//             t('SoldOut')
//           )}
//         </Btn>
//         <div className={`cart_qty qty-box ${isOpen && productQty >= 1 ? 'open' : ''}`}>
//           <InputGroup>
//             <Btn type='button' className='qty-left-minus' onClick={() => handleIncDec(-1, productObj, productQty, setProductQty, setIsOpen, getSelectedVariant ? getSelectedVariant : null)}>
//               <RiSubtractLine/>
//             </Btn>
//             <Input className='form-control input-number qty-input' type='text' name='quantity' value={productQty} readOnly />
//             <Btn type='button' className='qty-right-plus' onClick={() => handleIncDec(1, productObj, productQty, setProductQty, setIsOpen, getSelectedVariant ? getSelectedVariant : null)}>
//               <RiAddLine/>
//             </Btn>
//           </InputGroup>
//         </div>
//       </div>
//       <VariationModal setVariationModal={setVariationModal} variationModal={variationModal} productObj={productObj} />
//     </>
//   );
// };

// export default ProductBox1Cart;

// import React, { useContext } from 'react';
// import { useTranslation } from '@/app/i18n/client';
// import Btn from '@/Elements/Buttons/Btn';
// import I18NextContext from '@/Helper/I18NextContext';

// const ProductBox1Cart = ({ productObj }) => {
//   const { i18Lang } = useContext(I18NextContext);
//   const { t } = useTranslation(i18Lang, 'common');

//   const handleDownload = () => {
//     if (productObj.link_document) {
//       window.open(productObj.link_document, "_blank"); // Tải tài liệu
//     }
//   };

//   return (
//     <div className='add-to-cart-box'>
//       <Btn
//         className='btn-download'
//         disabled={!productObj?.link_document} // Vô hiệu hóa nếu không có URL tài liệu
//         onClick={handleDownload}
//       >
//         {productObj?.link ? t('Download Document') : t('No Document Available')}
//       </Btn>
//     </div>
//   );
// };

// export default ProductBox1Cart;

import React, { useContext } from 'react';
import { useTranslation } from '@/app/i18n/client';
import Btn from '@/Elements/Buttons/Btn';
import I18NextContext from '@/Helper/I18NextContext';
import request from '@/Utils/AxiosUtils';
import { CheckBalanceAPI, DeductBalanceAPI } from '@/Utils/AxiosUtils/API';
import CartContext from '@/Helper/CartContext';

const ProductBox1Cart = ({ productObj }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, 'common');
  const { updateCart } = useContext(CartContext); // Cập nhật giỏ hàng hoặc trạng thái nếu cần

  console.log('CheckBalanceAPI', CheckBalanceAPI);
  

  const handleDownload = async () => {
    try {
      // Bước 1: Kiểm tra số dư
      const balanceResponse = await request({
        url: `${CheckBalanceAPI}/${productObj?.id}`, // Gửi yêu cầu kiểm tra số dư
        method: 'GET',
      });

      if (balanceResponse.data.sufficient) {
        // Nếu số dư đủ, trừ tiền
        const deductResponse = await request({
          url: `${DeductBalanceAPI}/${productObj?.id}`, // Gửi yêu cầu trừ tiền
          method: 'POST',
          data: { price: productObj.price }, // Giá sản phẩm hoặc tài liệu
        });

        if (deductResponse.status === 200 && deductResponse.data?.link_document) {
          // Nếu trừ tiền thành công, mở liên kết tải tài liệu
          window.open(deductResponse.data.link_document, "_blank");
        } else {
          alert(t('Download link not available'));
        }
      } else {
        // Nếu không đủ số dư, hiển thị thông báo
        alert(t('Insufficient balance. Please add funds to your account.'));
      }
    } catch (error) {
      console.error('Error during download process:', error);
      alert(t('An error occurred. Please try again.'));
    }
  };

  return (
    <div className='add-to-cart-box'>
      <Btn
        className='btn-download'
        disabled={!productObj?.link_document} // Vô hiệu hóa nếu không có URL tài liệu
        onClick={handleDownload}
      >
        {productObj?.link_document ? t('Download') : t('No Document Available')}
      </Btn>
    </div>
  );
};

export default ProductBox1Cart;

