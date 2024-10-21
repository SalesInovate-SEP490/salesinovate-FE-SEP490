import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Scrollbars from "react-custom-scrollbars-2";
import { SidebarData } from "../../data/json/sidebarData";
import ImageWithBasePath from "../imageWithBasePath";
import { useDispatch, useSelector } from "react-redux";
import { setExpandMenu } from "../../data/redux/commonSlice";
import { all_routes } from "../../../feature-module/router/all_routes";
import { data } from "../../../core/data/authen/role"
import { getMenuDisplay } from "../../../utils/authen";
import { generateRandomKey } from "../../../utils/commonUtil";


const Sidebar = () => {
  const Location = useLocation();
  const expandMenu = useSelector((state: any) => state.expandMenu);
  const dispatch = useDispatch();

  const [subOpen, setSubopen] = useState("");
  const [subsidebar, setSubsidebar] = useState("");
  const [menus, setMenus] = useState<any[]>([]);
  const userName = useState(useSelector((state: any) => state.userName));
  const avatar = useSelector((state: any) => state.avatar);

  useEffect(() => {
    const updatedMenus = SidebarData.map((mainLabel) => {
      const updatedSubmenuItems = mainLabel.submenuItems.map((title: any) => ({
        ...title,
        display: getMenuDisplay(title?.link),
      }));
      const mainLabelDisplay = updatedSubmenuItems.some((title) => title.display);

      return {
        ...mainLabel,
        submenuItems: updatedSubmenuItems,
        display: mainLabelDisplay,
      };
    });
    setMenus(updatedMenus);
  }, [])

  const toggleSidebar = (title: any) => {
    if (title === subOpen) {
      setSubopen("");
    } else {
      setSubopen(title);
    }
  };

  const toggleSubsidebar = (subitem: any) => {
    if (subitem === subsidebar) {
      setSubsidebar("");
    } else {
      setSubsidebar(subitem);
    }
  };


  return (
    <>
      <div
        className="sidebar"
        id="sidebar"
      >
        <Scrollbars>
          <div className="sidebar-inner slimscroll">
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                <li className="clinicdropdown">
                  <Link to="#">
                    <img
                      src={avatar || "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png"}
                      className="img-fluid"
                      alt="Profile"
                    />
                    <div className="user-names">
                      <h5>{userName}</h5>
                    </div>
                  </Link>
                </li>
              </ul>

              <ul>
                {menus?.map((mainLabel, index) => (mainLabel.display &&
                  <li className="clinicdropdown" key={`${index} ${generateRandomKey()}`}>
                    <h6 className="submenu-hdr">{mainLabel?.label}</h6>

                    <ul>
                      {mainLabel?.submenuItems?.map((title: any, i: any) => {
                        let link_array: any = [];
                        if ("submenuItems" in title) {
                          title.submenuItems?.map((link: any) => {
                            link_array.push(link?.link);
                            if (link?.submenu && "submenuItems" in link) {
                              link.submenuItems?.map((item: any) => {
                                link_array.push(item?.link);
                              });
                            }
                          });
                        }
                        title.links = link_array;

                        return !title.display ? <></> : (
                          <>
                            <li className="submenu" key={i + `${generateRandomKey()}`}>
                              <Link
                                to={title?.link === all_routes.leadsDashboard ? "/jaganb" : title?.link}
                                onClick={() => toggleSidebar(title?.label)}
                                className={`${Location.pathname == title?.link
                                  ? "subdrop active"
                                  : ""
                                  } ${title?.links?.includes(Location.pathname)
                                    ? "active"
                                    : ""
                                  }
                            `}
                              >
                                {/* <Grid /> */}
                                <i className={title.icon}></i>

                                <span>{title?.label}</span>
                                <span
                                  className={title?.submenu ? "menu-arrow" : ""}
                                />
                              </Link>
                              <ul
                                style={{
                                  display:
                                    subOpen == title?.label ? "block" : "none",
                                }}
                              >
                                {title?.submenuItems?.map(
                                  (item: any, titleIndex: any) => (
                                    <li
                                      className="submenu submenu-two"
                                      key={titleIndex + `${generateRandomKey()}`}
                                    >
                                      {item.lebel}
                                      <Link
                                        to={item?.link}
                                        className={
                                          item?.submenuItems
                                            ?.map((link: any) => link?.link)
                                            .includes(Location.pathname) ||
                                            item?.link == Location.pathname
                                            ? "active"
                                            : ""
                                        }
                                        onClick={() => {
                                          toggleSubsidebar(item?.label);
                                        }}
                                      >
                                        {item?.label}
                                        <span
                                          className={
                                            item?.submenu ? "menu-arrow" : ""
                                          }
                                        />
                                      </Link>
                                      <ul
                                        style={{
                                          display:
                                            subsidebar == item?.label
                                              ? "block"
                                              : "none",
                                        }}
                                      >
                                        {item?.submenuItems?.map(
                                          (items: any, titleIndex: any) => (
                                            <li key={titleIndex + `${generateRandomKey()}`}>
                                              {/* {item.lebel} */}
                                              <Link
                                                to={items?.link}
                                                className={`${subsidebar == items?.label
                                                  ? "submenu-two subdrop"
                                                  : "submenu-two"
                                                  } ${items?.submenuItems
                                                    ?.map(
                                                      (link: any) => link.link
                                                    )
                                                    .includes(
                                                      Location.pathname
                                                    ) ||
                                                    items?.link ==
                                                    Location.pathname
                                                    ? "active"
                                                    : ""
                                                  }`}
                                              >
                                                {items?.label}
                                              </Link>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </li>
                                  )
                                )}
                              </ul>
                            </li>
                          </>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Scrollbars>
      </div>
    </>
  );
};

export default Sidebar;
