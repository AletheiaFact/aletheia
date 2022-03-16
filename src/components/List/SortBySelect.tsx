import React from "react";
import { Select } from "antd";

const { Option } = Select;

const SortBySelect = ({ onSelect = "asc" }) => {
  return (
    <Select 
    defaultValue=" ⇵Sort By" 
    style={{ width:120, marginLeft:"10px"}} 
    onSelect={onSelect}
    >   
      <Option value="desc">Desceding</Option>
      <Option value="asc">Ascending</Option>
    </Select>
  )
}
export default SortBySelect
