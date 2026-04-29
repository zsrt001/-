"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { GoldButton } from "@/components/ui";

type RedeemStatus = "idle" | "invalid" | "used" | "valid" | "error";

type RedeemResponse = {
  status?: "invalid" | "used" | "valid";
};

const statusCopy: Record<RedeemStatus, string> = {
  idle: "每个兑换码仅可使用一次。",
  invalid: "未找到此兑换码，请检查后再试。",
  used: "此兑换码已被使用。",
  valid: "兑换成功，正在进入测试。",
  error: "校验暂时失败，请稍后再试。"
};

export function RedeemForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<RedeemStatus>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedCode = code.trim();

    if (!normalizedCode) {
      setStatus("invalid");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code: normalizedCode })
      });
      const data = (await response.json()) as RedeemResponse;

      if (!response.ok) {
        setStatus("error");
        return;
      }

      if (data.status === "valid") {
        sessionStorage.setItem("soul-atlas-redeem-code", normalizedCode);
        setStatus("valid");
        router.push("/intro");
        return;
      }

      setStatus(data.status === "used" ? "used" : "invalid");
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="redeem-form" onSubmit={handleSubmit}>
      <label className="redeem-form__label" htmlFor="redeem-code">
        兑换码
      </label>
      <div className="redeem-form__field">
        <input
          autoComplete="off"
          id="redeem-code"
          inputMode="text"
          onChange={(event) => {
            setCode(event.target.value);
            if (status !== "idle") {
              setStatus("idle");
            }
          }}
          placeholder="请输入兑换码"
          spellCheck={false}
          type="text"
          value={code}
        />
      </div>
      <p className={`redeem-form__message redeem-form__message--${status}`}>
        {statusCopy[status]}
      </p>
      <GoldButton
        className="redeem-form__submit"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "校验中" : "开始测试"}
      </GoldButton>
    </form>
  );
}
