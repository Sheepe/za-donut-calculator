import {
    Badge,
    Group,
    NumberInput,
    Select,
    Text,
    type DefaultMantineColor,
    type SelectProps,
    type StyleProp,
} from "@mantine/core"
import {
    FaAnglesDown,
    FaAnglesUp,
    FaBan,
    FaCheck,
    FaEquals,
    FaPlusMinus,
} from "react-icons/fa6"
import Option from "./Option"
import type { Goal } from "../../solver/solver.worker"
import { useEffect, useState } from "react"

const ICON_SIZE = 14

const icons: Record<string, React.ReactNode> = {
    min: <FaAnglesDown size={ICON_SIZE} />,
    max: <FaAnglesUp size={ICON_SIZE} />,
    exact: <FaEquals size={ICON_SIZE} />,
    approx: <FaPlusMinus size={ICON_SIZE} />,
    ignore: <FaBan size={ICON_SIZE} />,
}

const renderOption: SelectProps["renderOption"] = ({ option, checked }) => (
    <Group flex="1" gap="xs">
        {icons[option.value]}
        <span>{option.label}</span>
        {checked && (
            <span style={{ marginInlineStart: "auto", opacity: 0.6 }}>
                <FaCheck />
            </span>
        )}
    </Group>
)

interface FlavourOptionProps {
    name: string
    backgroundColor: StyleProp<DefaultMantineColor>
    textColor: StyleProp<DefaultMantineColor>
    goal: Goal
    onGoalChange: (value: Goal) => void
}

const getModeDisplayName = (mode: Goal["mode"], target?: number) => {
    switch (mode) {
        case "ignore":
            return "IGNORE"
        case "min":
            return "MINIMIZE"
        case "max":
            return "MAXIMIZE"
        case "approx":
            return `≈ ${Math.min(Math.max(target ?? 0, 0), 760)}`
        case "exact":
            return `= ${Math.min(Math.max(target ?? 0, 0), 760)}`
    }
}

const FlavourOption = ({
    name,
    textColor,
    backgroundColor,
    goal,
    onGoalChange,
}: FlavourOptionProps) => {
    const [draftMode, setDraftMode] = useState<Goal["mode"]>(goal.mode)
    const [draftTarget, setDraftTarget] = useState<number>(goal.target ?? 0)

    useEffect(() => {
        setDraftMode(goal.mode)
        setDraftTarget(goal.target ?? 0)
    }, [goal])

    const onBlur = () => {
        onGoalChange({
            ...goal,
            mode: draftMode,
            target: draftTarget,
        })
    }

    return (
        <>
            <Option
                name={name}
                textColor={textColor}
                backgroundColor={backgroundColor}
                header={
                    <Badge c={backgroundColor} bg={textColor} size="lg">
                        {getModeDisplayName(draftMode, draftTarget)}
                    </Badge>
                }
            >
                <Group gap={0} w="100%" p={0}>
                    <Select
                        label={
                            <Text
                                size="xs"
                                c={textColor}
                                fw={650}
                                component="span"
                            >
                                MODE
                            </Text>
                        }
                        leftSection={icons[draftMode]}
                        allowDeselect={false}
                        value={draftMode}
                        pr="lg"
                        pl="lg"
                        maw="200px"
                        data={[
                            {
                                group: "",
                                items: [
                                    {
                                        value: "ignore",
                                        label: "Ignore",
                                    },
                                    {
                                        value: "exact",
                                        label: "Exactly",
                                    },
                                ],
                            },
                            {
                                group: "Approximate",
                                items: [
                                    {
                                        value: "min",
                                        label: "Minimize",
                                    },
                                    {
                                        value: "max",
                                        label: "Maximize",
                                    },
                                    {
                                        value: "approx",
                                        label: "Around",
                                    },
                                ],
                            },
                        ]}
                        radius="xl"
                        checkIconPosition="right"
                        renderOption={renderOption}
                        onChange={(value) => {
                            if (value === null) return
                            setDraftMode(value as Goal["mode"])
                        }}
                        onBlur={onBlur}
                    />
                    <NumberInput
                        label={
                            <Text
                                size="xs"
                                c={textColor}
                                fw={650}
                                component="span"
                            >
                                TARGET
                            </Text>
                        }
                        clampBehavior="blur"
                        min={0}
                        max={760}
                        allowNegative={false}
                        allowLeadingZeros={false}
                        allowDecimal={false}
                        value={draftTarget}
                        display={
                            draftMode === "exact" || draftMode === "approx"
                                ? "block"
                                : "none"
                        }
                        pr="lg"
                        pl="lg"
                        maw="200px"
                        radius="xl"
                        hideControls
                        onChange={(v) => {
                            setDraftTarget(typeof v === "string" ? 0 : v)
                        }}
                        onBlur={onBlur}
                    />
                </Group>
            </Option>
        </>
    )
}

export default FlavourOption
