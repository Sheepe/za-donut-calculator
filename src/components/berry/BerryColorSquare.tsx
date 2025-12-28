import { Box, Flex } from "@mantine/core"

interface BerryColorSquareProps {
    colors: readonly string[]
}

const BerryColorSquare = ({ colors }: BerryColorSquareProps) => {
    const swatches = []

    for (let i = 0; i < colors.length; i++) {
        swatches.push(
            <Box
                p={0}
                m={0}
                style={{ flexGrow: 1 }}
                w="100%"
                bg={colors[i]}
                key={i}
            />
        )
    }

    return (
        <Flex
            direction="row"
            w="18px"
            h="18px"
            bdrs="xl"
            style={{ overflow: "hidden" }}
            p={0}
        >
            {swatches}
        </Flex>
    )
}

export default BerryColorSquare
