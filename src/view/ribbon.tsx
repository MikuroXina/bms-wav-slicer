import { Button } from "@heroui/react/button";
import { Dropdown } from "@heroui/react/dropdown";
import { Label } from "@heroui/react/label";

import { useDispatch } from "../model/action.js";
import { quantizeTypes, type QuantizeMode, type QuantizeType } from "../model/quantize.js";

const quantizeLabel: Record<QuantizeType, string> = {
    WHOLE: "Whole",
    HALF: "Half",
    QUARTER: "Quarter",
    "1/8": "1/8",
    "1/16": "1/16",
    "1/32": "1/32",
    "1/64": "1/64",
};

export interface RibbonProps {
    quantizeMode: QuantizeMode;
}

export const Ribbon = ({ quantizeMode }: RibbonProps) => {
    const dispatch = useDispatch();

    return (
        <div className="flex w-full justify-between border-b p-1">
            <div></div>
            <div>
                <Dropdown>
                    <Button variant="secondary">Set Quantize</Button>
                    <Dropdown.Popover>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={() => {
                                    dispatch({ type: "TOGGLE_QUANTIZE_TRIPLET" });
                                }}
                            >
                                <Label>Triplet</Label>
                                <Dropdown.ItemIndicator>
                                    {quantizeMode.isTriplet ? "✓" : ""}
                                </Dropdown.ItemIndicator>
                            </Dropdown.Item>
                            <Dropdown.SubmenuTrigger>
                                <Dropdown.Item id="share" textValue="Share">
                                    <Label>Quantum</Label>
                                    <Dropdown.SubmenuIndicator />
                                </Dropdown.Item>
                                <Dropdown.Popover>
                                    <Dropdown.Menu>
                                        {quantizeTypes.map((type) => (
                                            <Dropdown.Item
                                                key={type}
                                                onClick={() => {
                                                    dispatch({
                                                        type: "SET_QUANTIZE_TYPE",
                                                        oldType: quantizeMode.type,
                                                        newType: type,
                                                    });
                                                }}
                                            >
                                                <Label>{quantizeLabel[type]}</Label>
                                                <Dropdown.ItemIndicator>
                                                    {type === quantizeMode.type ? "✓" : ""}
                                                </Dropdown.ItemIndicator>
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown.Popover>
                            </Dropdown.SubmenuTrigger>
                        </Dropdown.Menu>
                    </Dropdown.Popover>
                </Dropdown>
            </div>
        </div>
    );
};
