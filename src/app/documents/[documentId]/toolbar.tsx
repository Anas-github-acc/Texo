'use client'
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import { BoldIcon, ChevronDownIcon, CodeIcon, ItalicIcon, ListTodoIcon, LucideIcon, MessageSquareIcon, MessageSquarePlusIcon, MessagesSquareIcon, Printer, Redo2Icon, RemoveFormattingIcon, SpellCheckIcon, UnderlineIcon, Undo2Icon } from "lucide-react";
import{
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ToolbarButtonProps{
 onClick?:()=>void;
 isActive?:boolean;
 icon:LucideIcon
}

const FontFamilyButton=()=>{
    const {editor}=useEditorStore();

    const fonts = [
    { label: "Arial", value: "Arial" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Courier New", value: "Courier New" },
    { label: "Georgia", value: "Georgia" },
    { label: "Verdana", value: "Verdana" },
    { label: "Tahoma", value: "Tahoma" },
    { label: "Comic Sans MS", value: "Comic Sans MS" },
    { label: "Impact", value: "Impact" },
    { label: "Lucida Console", value: "Lucida Console" },
    { label: "Lucida Sans Unicode", value: "Lucida Sans Unicode" },
    { label: "Palatino Linotype", value: "Palatino Linotype" },
    { label: "Trebuchet MS", value: "Trebuchet MS" },
    { label: "Garamond", value: "Garamond" },
    { label: "Arial Black", value: "Arial Black" },
    { label: "Bookman", value: "Bookman" },
    { label: "Candara", value: "Candara" },
    { label: "Franklin Gothic Medium", value: "Franklin Gothic Medium" },
    { label: "Gill Sans", value: "Gill Sans" },
    { label: "Helvetica", value: "Helvetica" },
    { label: "Lucida Bright", value: "Lucida Bright" },
    { label: "Segoe UI", value: "Segoe UI" },
    { label: "Courier", value: "Courier" },
    { label: "Lucida Sans", value: "Lucida Sans" },
    { label: "Monaco", value: "Monaco" },
    { label: "Optima", value: "Optima" },
    { label: "Brush Script MT", value: "Brush Script MT" },
    { label: "Futura", value: "Futura" },
    { label: "Baskerville", value: "Baskerville" },
    { label: "Didot", value: "Didot" },
    { label: "Rockwell", value: "Rockwell" },
];

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <button
            className="h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
                <span className="truncate">
                {editor?.getAttributes("textStyle").fontFamily||"Arial"}
                </span>
                <ChevronDownIcon className="ml-2 size-4 shrink-0"/>
            </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="pl-1 flex flex-col gap-y-1 max-h-60 max-w-30 overflow-y-auto">
            {fonts.map(({label,value})=>(
            <button
            onClick={()=> editor?.chain().focus().setFontFamily(value).run()}
            key={value}
            className={cn(
                "flex items-center gap-x-2 px-2 py-1 rounded-sm font-[value] hover:bg-neutral-200/80",
                editor?.getAttributes("textStyle").fontFamily===value&&"bg-neutral-200/80"
            )}
            style={{fontFamily:value}}>
                <span className="text-sm">{label}</span>
            </button>
            ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const HeadingLevelButton=()=>{
    const {editor}=useEditorStore();
}

const ToolbarButton=({
    onClick,
    isActive,
    icon:Icon,
}:ToolbarButtonProps)=>{
    return(
        <button onClick={onClick}
        className={cn(
            "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
            isActive && "bg-neutral-200/80"
        )}>
            <Icon className="size-4"/>
        </button>
    )

}

export const Toolbar = () => {
    const {editor}=useEditorStore();
    const sections:{
        label:string;
        icon:LucideIcon;
        onClick:()=>void;
        isActive?:boolean;
    }[][]=[
        [
            {
                label:"Undo",
                icon:Undo2Icon,
                onClick:()=>editor?.chain().focus().undo().run(),
            },
            {
                label:"Redo",
                icon:Redo2Icon,
                onClick:()=>editor?.chain().focus().redo().run(),
            },
            {
                label:"Print",
                icon:Printer,
                onClick:()=>window.print(),
            },
            {
                label:"SpellCheck",
                icon:SpellCheckIcon,
                onClick:()=>{
                   const current = editor?.view.dom.getAttribute("spellcheck");
                     editor?.view.dom.setAttribute("spellcheck",current==="false"?"true":"false");
                    },
            },
        ],
        [
            {
                label:"Bold",
                icon:BoldIcon,
                isActive:editor?.isActive("bold"),
                onClick:()=>editor?.chain().focus().toggleBold().run(),
            },
            {
                label:"Italic",
                icon:ItalicIcon,
                isActive:editor?.isActive("italic"),
                onClick:()=>editor?.chain().focus().toggleItalic().run(),
            },
            {
                label:"Underline",
                icon:UnderlineIcon,
                isActive:editor?.isActive("underline"),
                onClick:()=>editor?.chain().focus().toggleUnderline().run(),
            },
           
        ],
            [
                {
                    label:"Codeblock",
                    icon:CodeIcon,
                    isActive:editor?.isActive("codeBlock"),
                    onClick:()=>editor?.chain().focus().toggleCodeBlock().run(),
                },
            {
                label:"Comments",
                icon:MessageSquarePlusIcon,
                onClick:()=>console.log("Comments"),
                isActive:false,
            },
            {
                label:"List Todo",
                icon:ListTodoIcon,
                onClick:()=>editor?.chain().focus().toggleTaskList().run(),
                isActive:editor?.isActive("taskList"),
            },
            {
                label:"Remove Formatting",
                icon:RemoveFormattingIcon,
                onClick:()=>editor?.chain().focus().unsetAllMarks().run(),
            },
        
        ],
    ];
    return (
        <div className="bg-[#f1f4f9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto">
           {sections[0].map((item)=>(
            <ToolbarButton key={item.label}{...item}/>
        ))}
        <Separator orientation="vertical" className="h-6 bg-neutral-300"/>
       <FontFamilyButton />
        <Separator orientation="vertical" className="h-6 bg-neutral-300"/>
        {/* TODO:Heading */}
        <Separator orientation="vertical" className="h-6 bg-neutral-300"/>
        {/* TODO:font size */}
        <Separator orientation="vertical" className="h-6 bg-neutral-300"/>
        {sections[1].map((item)=>(
            <ToolbarButton key={item.label}{...item}/>
        ))}
        {/*TODO:text color */}
        {/*TODO:hightlight color */}
        <Separator orientation="vertical" className="h-6 bg-neutral-300"/>
        {/*TODO:link */}
        {/*TODO:Image */}
        {/*TODO:Align */}
        {/*TODO:line height */}
        {/*TODO:list*/}
        {sections[2].map((item)=>(
            <ToolbarButton key={item.label}{...item}/>
        ))}
        </div>
    )
}