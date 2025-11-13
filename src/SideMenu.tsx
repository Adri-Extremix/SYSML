import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CropLandscapeRoundedIcon from "@mui/icons-material/CropLandscapeRounded";
import CropLandscapeSharpIcon from "@mui/icons-material/CropLandscapeSharp";

const drawerWidth = 400;

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "block",
    alignItems: "left",
    padding: 10,
    justifyContent: "flex-end",
}));

export default function SideMenu({ addNode }) {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        // Aplicar margin-left al body para que el drawer empuje la interfaz
        const prevTransition = document.body.style.transition;
        document.body.style.transition = "margin-left 225ms ease";
        if (open) {
            document.body.style.marginLeft = `${drawerWidth}px`;
        } else {
            document.body.style.marginLeft = "";
        }
        return () => {
            document.body.style.marginLeft = "";
            document.body.style.transition = prevTransition;
        };
    }, [open]);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const types = {
        "Clase Cuadrada": { type: "squared", icon: <CropLandscapeSharpIcon /> },
        "Clase Redondeada": {
            type: "rounded",
            icon: <CropLandscapeRoundedIcon />,
        },
    };

    return (
        <Box sx={{ display: "flex" }}>
            {!open && (
                <button
                    onClick={handleDrawerOpen}
                    style={{
                        position: "relative",
                        zIndex: 999,
                        margin: 10,
                        width: "auto",
                        fontSize: "14pt",
                        padding: 6,
                        backgroundColor: "white",
                        borderRadius: 5,
                    }}
                >
                    Añadir clase
                </button>
            )}

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        <CloseIcon />
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {Object.entries(types).map(([text, { type, icon }]) => (
                        <ListItem
                            key={text}
                            disablePadding
                            onClick={() => {
                                addNode(type);
                                setOpen(false);
                            }}
                        >
                            <ListItemButton>
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
}