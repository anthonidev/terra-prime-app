import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UserInfoProps {
  name: string;
  email?: string;
  photo?: string | null;
  document?: string;
  documentType?: string;
  phone?: string;
  className?: string;
}

export function UserInfo({
  name,
  email,
  photo,
  document,
  documentType,
  phone,
  className,
}: UserInfoProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Avatar className="h-9 w-9 border">
        <AvatarImage src={photo || undefined} alt={name} />
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm leading-none font-medium">{name}</span>
        {email && <span className="text-muted-foreground text-xs">{email}</span>}
        {(document || phone) && (
          <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs">
            {document && (
              <span className="flex items-center gap-1">
                {documentType && (
                  <Badge variant="outline" className="h-4 px-1 py-0 text-[10px] font-normal">
                    {documentType}
                  </Badge>
                )}
                <span className="font-mono text-[11px]">{document}</span>
              </span>
            )}
            {document && phone && <span>•</span>}
            {phone && <span>{phone}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
