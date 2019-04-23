import Vue from 'vue';
import {
  Col, Row, Menu, Container,
  Submenu, Dropdown, DropdownMenu,
  DropdownItem, MenuItem,
  TabPane, Input, Card,
  Form, FormItem,
  Button, ButtonGroup, TableColumn,
  Option, Dialog,
  Loading, Tag, Popover,
  RadioGroup, RadioButton,
  Switch, Radio,
  CheckboxGroup, Checkbox, OptionGroup,
  Pagination, Alert, Tooltip,
  Message, MessageBox, Notification,
  MenuItemGroup,
  Collapse, CollapseItem,
  Header, Main,
  Footer,
} from 'element-ui';

export default () => {
  Vue.use(Col);
  Vue.use(Header);
  Vue.use(Row);
  Vue.use(Menu);
  Vue.use(Container);
  Vue.use(MenuItem);
  Vue.use(Submenu);
  Vue.use(Dropdown);
  Vue.use(DropdownItem);
  Vue.use(DropdownMenu);
  Vue.use(TabPane);
  Vue.use(Input);
  Vue.use(Card);
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Button);
  Vue.use(ButtonGroup);
  Vue.use(TableColumn);
  Vue.use(Option);
  Vue.use(Dialog);
  Vue.use(Loading);
  Vue.use(Tag);
  Vue.use(Popover);
  Vue.use(RadioGroup);
  Vue.use(RadioButton);
  Vue.use(Switch);
  Vue.use(Radio);
  Vue.use(CheckboxGroup);
  Vue.use(Checkbox);
  Vue.use(OptionGroup);
  Vue.use(Pagination);
  Vue.use(Alert);
  Vue.use(Tooltip);
  Vue.use(MenuItemGroup);
  Vue.use(Collapse);
  Vue.use(CollapseItem);
  Vue.use(Main);
  Vue.use(Footer);

  Vue.prototype.$message = Message;
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$notify = Notification;
};
