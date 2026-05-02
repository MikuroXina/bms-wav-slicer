import { Button } from "@heroui/react/button";
import { Dropdown } from "@heroui/react/dropdown";
import { Kbd } from "@heroui/react/kbd";
import { Label } from "@heroui/react/label";
import type { ReactNode } from "react";

import { useDispatch } from "../model/action.js";
import { useLoading } from "../model/loading.js";
import { addTrack } from "../service/add-track.js";
import { importMidi } from "../service/import-midi.js";

interface MenuItemProps {
    key: string;
    name: string;
    children: ReactNode;
}

const MenuItem = ({ name, children }: MenuItemProps) => {
    return (
        <Dropdown>
            <Button variant="ghost">{name}</Button>
            <Dropdown.Popover>{children}</Dropdown.Popover>
        </Dropdown>
    );
};

export const MenuBar = () => {
    const dispatch = useDispatch();
    const { setIsLoading } = useLoading();

    const menuItems: readonly MenuItemProps[] = [
        {
            key: "file",
            name: "File",
            children: (
                <Dropdown.Menu>
                    <Dropdown.Item id="save">
                        <Label>Save As…</Label>
                        <Kbd className="ms-auto" slot="keyboard" variant="light">
                            <Kbd.Abbr keyValue="command" />
                            <Kbd.Content>S</Kbd.Content>
                        </Kbd>
                    </Dropdown.Item>
                </Dropdown.Menu>
            ),
        },
        {
            key: "track",
            name: "Track",
            children: (
                <Dropdown.Menu>
                    <Dropdown.Item id="add-track" onClick={() => addTrack(dispatch)}>
                        <Label>Add Track…</Label>
                        <Kbd className="ms-auto" slot="keyboard" variant="light">
                            <Kbd.Abbr keyValue="command" />
                            <Kbd.Content>A</Kbd.Content>
                        </Kbd>
                    </Dropdown.Item>
                    <Dropdown.Item
                        id="import-midi"
                        onClick={() => importMidi(dispatch, setIsLoading)}
                    >
                        <Label>Import MIDI…</Label>
                        <Kbd className="ms-auto" slot="keyboard" variant="light">
                            <Kbd.Abbr keyValue="command" />
                            <Kbd.Content>M</Kbd.Content>
                        </Kbd>
                    </Dropdown.Item>
                </Dropdown.Menu>
            ),
        },
    ];
    return (
        <div className="bg-overlay flex w-full">
            {menuItems.map((props) => (
                <MenuItem {...props} key={props.key} />
            ))}
        </div>
    );
};
