import { Button } from "@heroui/react/button";
import { Dropdown } from "@heroui/react/dropdown";
import { Label } from "@heroui/react/label";
import { Slider } from "@heroui/react/slider";

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
    xScale: number;
    quantizeMode: QuantizeMode;
}

export const Ribbon = ({ xScale, quantizeMode }: RibbonProps) => {
    const dispatch = useDispatch();

    return (
        <div className="flex w-full justify-between border-b p-1">
            <div className="flex items-center">
                <Slider
                    className="flex w-32 flex-row items-center"
                    aria-label="Horizontal scale"
                    value={20 * Math.log10(xScale)}
                    minValue={-10}
                    maxValue={10}
                    step={1}
                    onChange={(value: number) => {
                        dispatch({
                            type: "PREVIEW_HORIZONTAL_SCALE",
                            newScale: Math.pow(10, value / 20),
                        });
                    }}
                    onChangeEnd={(value: number) => {
                        dispatch({
                            type: "SET_HORIZONTAL_SCALE",
                            oldScale: xScale,
                            newScale: Math.pow(10, value / 20),
                        });
                    }}
                >
                    ←→
                    <Slider.Track>
                        <Slider.Fill />
                        <Slider.Thumb className="size-1 rounded-full bg-transparent" />
                    </Slider.Track>
                </Slider>
            </div>
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
