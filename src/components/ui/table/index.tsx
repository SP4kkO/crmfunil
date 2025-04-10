import React, { ReactNode } from "react";

// Props para Table
interface TableProps {
  children: ReactNode; // Conteúdo da tabela (thead, tbody, etc.)
  className?: string; // ClassName opcional para customização
}

// Props para TableHeader
interface TableHeaderProps {
  children: ReactNode; // Linha(s) do cabeçalho
  className?: string; // ClassName opcional para customização
}

// Props para TableBody
interface TableBodyProps {
  children: ReactNode; // Linha(s) do corpo da tabela
  className?: string; // ClassName opcional para customização
}

// Props para TableRow – agora com suporte a onClick
interface TableRowProps {
  children: ReactNode; // Células (th ou td)
  className?: string; // ClassName opcional para customização
  onClick?: React.MouseEventHandler<HTMLTableRowElement>; // onClick para a linha
}

// Props para TableCell
interface TableCellProps {
  children: ReactNode; // Conteúdo da célula
  isHeader?: boolean; // Se true, renderiza como <th>; caso contrário, <td>
  className?: string; // ClassName opcional para customização
}

// Componente Table
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full ${className}`}>{children}</table>;
};

// Componente TableHeader
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

// Componente TableBody
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// Componente TableRow com onClick
const TableRow: React.FC<TableRowProps> = ({ children, className, onClick }) => {
  return (
    <tr className={className} onClick={onClick}>
      {children}
    </tr>
  );
};

// Componente TableCell
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
}) => {
  const CellTag = isHeader ? "th" : "td";
  return <CellTag className={className}>{children}</CellTag>;
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
