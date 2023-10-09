import { useCurrentSelection } from "@remirror/react";

export default function useUpdateSelection() {
    const { empty } = useCurrentSelection();
    const isSelected = !empty;

    return isSelected;
}
