import React, { useState } from "react";
import { Select } from "antd";

const { Option } = Select;

const SortByButton = ({ onSelect, defaultValue = "asc" }) => {
  return (
    <Select 
      defaultValue={defaultValue}
      onSelect={onSelect}
    >
      <Option value="desc">Desceding</Option>
      <Option value="asc">Ascending</Option>
    </Select>
  )
}
export default SortByButton