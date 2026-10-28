import { getInitialUserName } from '@/lib/helpers/avatarInitials';
import { Avatar, AvatarBadge, AvatarFallback } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';

type UserPopoverProps = {
  userName: string;
  signInUser: boolean;
  signInUserEmail: string;
};

const UserPopover = ({
  userName,
  signInUser,
  signInUserEmail,
}: UserPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="Open account details on user avatar"
        className="cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar>
          <AvatarFallback>
            {getInitialUserName(userName || 'RIT')}
          </AvatarFallback>
          <AvatarBadge
            className={`${signInUser ? 'bg-green-600' : 'bg-gray-400'} dark:bg-green-800`}
          />
        </Avatar>
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={15} className="w-64">
        <div className="flex items-start gap-3">
          {userName && (
            <Avatar>
              <AvatarFallback>{getInitialUserName(userName)}</AvatarFallback>
            </Avatar>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium capitalize">
              {userName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {signInUserEmail}
            </p>
            <Badge className="border-transparent bg-green-600/10 text-green-700 mt-2 -ml-1">
              Logged in
            </Badge>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserPopover;
