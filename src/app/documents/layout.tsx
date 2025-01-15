interface DocumentLayoutProps {
    children: React.ReactNode;
}

const DocumentLayout = ({children}:DocumentLayoutProps) => {
    return ( 
        <div className="flex flex-col justify-normal">
                {children}</div>
     );
}
 
export default DocumentLayout;