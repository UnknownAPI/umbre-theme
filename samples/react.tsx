type ButtonProps = {
  label: string;
  active?: boolean;
  onPress: () => void;
};

export const AccentButton = ({ label, active = false, onPress }: ButtonProps) => (
  <button data-active={active} onClick={onPress} className="rounded-md border px-3 py-2 text-sm">
    <span>{label}</span>
  </button>
);
