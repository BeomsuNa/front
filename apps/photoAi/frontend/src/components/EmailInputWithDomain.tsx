import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  domains?: string[];
  placeholder?: string;
  className?: string;
  isVerified?: boolean;
};

const DEFAULT_DOMAINS = [
  "gmail.com",
  "naver.com",
  "daum.net",
  "hanmail.net",
  "hotmail.com",
  "icloud.com",
  "kakao.com",
  "yahoo.com",
  "outlook.com",
];


export default function EmailInputWithDomain({
  value,
  onChange,
  domains = DEFAULT_DOMAINS,
  placeholder = "이메일을 입력하세요",
  className = "",
  isVerified
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // local@domainPart 형태로 분리
  const [localPart, domainPart] = useMemo(() => {
        const at = value.indexOf("@");
    if (at === 0) return [value, ""];
    return [value.slice(0, at), value.slice(at + 1)];
  }, [value]);


  // 제안 목록 계산: '@'가 있고, 로컬파트가 존재할 때만
  const suggestions = useMemo(() => {
    if (!localPart || value.indexOf("@") === -1) return [];
    const list =
      domainPart.length === 0
        ? domains
        : domains.filter((d) => d.toLowerCase().startsWith(domainPart.toLowerCase()));
    // 같은 항목 중복 제거 + 최대 8개 정도로 제한
    return Array.from(new Set(list)).slice(0, 8).map((d) => `${localPart}@${d}`);
  }, [localPart, domainPart, domains]);

  // 드롭다운 열기/닫기 조건
  useEffect(() => {
    setOpen(suggestions.length > 0);
    setActiveIndex(0);
  }, [suggestions]);

  // 바깥 클릭 감지 (DOM 이벤트 → MouseEvent 타입)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const commit = (next: string) => {
    onChange(next);
    setOpen(false);
    // 커서 맨 끝 포커스 유지
    inputRef.current?.focus();
  };

  // 키보드 내비게이션
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      commit(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <label className="block text-gray-700 text-sm font-bold mb-2">이메일</label>
      <input
        ref={inputRef}
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={`w-full shadow appearance-none border rounded py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400
        ${isVerified ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "text-gray-700"}`}
  aria-autocomplete="list"
  aria-expanded={open}
  aria-activedescendant={open ? `email-opt-${activeIndex}` : undefined}
  readOnly={isVerified}
  disabled={isVerified}
      />

      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-auto"
        >
          {suggestions.map((s, i) => (
            <li
              id={`email-opt-${i}`}
              role="option"
              key={s}
              aria-selected={i === activeIndex}
              className={`px-3 py-2 cursor-pointer text-sm ${
                i === activeIndex ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
              }`}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseDown={(e) => {
                // input blur 방지
                e.preventDefault();
                commit(s);
              }}
            >
              {highlightDomain(s, domainPart)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** 도메인 부분 강조(선택) */
function highlightDomain(full: string, domainPart: string) {
  const atIdx = full.indexOf("@");
  const local = full.slice(0, atIdx + 1);
  const domain = full.slice(atIdx + 1);
  const strongLen = Math.min(domainPart.length, domain.length);
  return (
    <span>
      <span className="text-gray-700">{local}</span>
      <span className="font-medium">{domain.slice(0, strongLen)}</span>
      <span className="text-gray-700">{domain.slice(strongLen)}</span>
    </span>
  );
}