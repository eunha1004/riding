import { useEffect, useId, useState } from "react";
import {
  loadTossPayments,
  TossPaymentsWidgets,
  WidgetSelectedPaymentMethod,
  ANONYMOUS,
} from "@tosspayments/tosspayments-sdk";

type UseTossPaymentsWidgetsParams = {
  paymentAmount: number;
};

const useTossPaymentsWidgets = ({
  paymentAmount,
}: UseTossPaymentsWidgetsParams) => {
  const id = useId();
  const paymentMethodId = `payment-method-${id}`;
  const agreementId = `agreement-${id}`;

  const [tossPaymentsWidgets, setTossPaymentsWidgets] =
    useState<TossPaymentsWidgets>();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<WidgetSelectedPaymentMethod>();
  const [agreedRequiredTerms, setAgreedRequiredTerms] = useState(true);

  useEffect(() => {
    loadTossPayments("test_gck_6BYq7GWPVv2AMzGlgxP4VNE5vbo1").then(
      (tossPaymentsSDK) => {
        const widgets = tossPaymentsSDK.widgets({ customerKey: ANONYMOUS });
        setTossPaymentsWidgets(widgets);
      }
    );
  }, []);

  useEffect(() => {
    void tossPaymentsWidgets?.setAmount({
      currency: "KRW",
      value: paymentAmount,
    });
  }, [paymentAmount]);

  useEffect(() => {
    if (!tossPaymentsWidgets) return;
    tossPaymentsWidgets.setAmount({ currency: "KRW", value: paymentAmount });
    let destroy = () => {};
    tossPaymentsWidgets
      .renderPaymentMethods({
        selector: escapeSelector(`#${paymentMethodId}`),
      })
      .then((paymentMethods) => {
        paymentMethods.on("paymentMethodSelect", setSelectedPaymentMethod);
        destroy = () => paymentMethods.destroy();
        return paymentMethods.getSelectedPaymentMethod();
      })
      .then((paymentMethod) => {
        setSelectedPaymentMethod(paymentMethod);
      });

    return () => destroy();
  }, [tossPaymentsWidgets, paymentMethodId]);

  useEffect(() => {
    if (!tossPaymentsWidgets) return;
    let destroy = () => {};
    tossPaymentsWidgets
      .renderAgreement({
        selector: escapeSelector(`#${agreementId}`),
      })
      .then((agreement) => {
        agreement.on("agreementStatusChange", ({ agreedRequiredTerms }) => {
          setAgreedRequiredTerms(agreedRequiredTerms);
        });
        return agreement;
      })
      .then((agreement) => {
        destroy = () => agreement.destroy();
        return agreement;
      });
    return () => destroy();
  }, [tossPaymentsWidgets, agreementId]);

  return {
    tossPaymentsWidgets,
    selectedPaymentMethod,
    agreedRequiredTerms,
    paymentMethodElement: <div id={paymentMethodId} />,
    agreementElement: <div id={agreementId} />,
  };
};

export default useTossPaymentsWidgets;

const escapeSelector = (selector: string) => {
  return selector.replace(/:/g, "\\:");
};
