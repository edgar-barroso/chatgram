import { Group } from "../@types/types";

interface GroupItemProps {
  group: Group;
}

export default function GroupItem({ group }: GroupItemProps) {
  return (
    <div className="flex items-center gap-2 hover:bg-light-gray cursor-pointer py-2 px-4">
      <div className="flex w-10 h-10 rounded-full items-center justify-center bg-ice-blue text-white">
        {group.name.charAt(0)}
      </div>
      <div className="flex-1">
        <p className=" text-rich-black">{group.name}</p>
        <p className="text-sm text-navy-gray">{group.members.length} members</p>
      </div>
    </div>
  );
}
